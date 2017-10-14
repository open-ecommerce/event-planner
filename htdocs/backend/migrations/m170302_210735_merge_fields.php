<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_210735_merge_fields extends Migration
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
            '{{%merge_fields}}',
            [
                'merge_field_id'=> $this->primaryKey(11),
                'merge_field_name'=> $this->string(40)->null()->defaultValue(null),
                'merge_field_code'=> $this->string(250)->null()->defaultValue(null),
                'merge_field_description'=> $this->text()->null()->defaultValue(null),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%merge_fields}}');
    }
}
