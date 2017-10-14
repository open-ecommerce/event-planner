<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_210743_saved_email_templates extends Migration
{

    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $tableOptions = 'ENGINE=InnoDB';

        $this->createTable(
            '{{%saved_email_templates}}',
            [
                'template_id'=> $this->primaryKey(11),
                'template_name'=> $this->string(100)->null()->defaultValue(null),
                'template_description'=> $this->text()->null()->defaultValue(null),
                'template_body'=> $this->text()->null()->defaultValue(null),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%saved_email_templates}}');
    }
}
