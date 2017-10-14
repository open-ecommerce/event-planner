<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_210728_group extends Migration
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
            '{{%group}}',
            [
                'group_id'=> $this->primaryKey(11),
                'group_name'=> $this->string(50)->null()->defaultValue(null),
                'group_description'=> $this->text()->null()->defaultValue(null),
                'designation_id'=> $this->integer(11)->null()->defaultValue(null),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%group}}');
    }
}
