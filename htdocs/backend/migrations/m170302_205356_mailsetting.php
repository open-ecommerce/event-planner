<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_205356_mailsetting extends Migration
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
            '{{%mailsetting}}',
            [
                'setting_id'=> $this->primaryKey(11),
                'setting_name'=> $this->string(50)->notNull(),
                'setting_code'=> $this->string(50)->notNull(),
                'setting_value'=> $this->string(90)->notNull(),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%mailsetting}}');
    }
}
